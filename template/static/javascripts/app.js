'use strict';

var vm = new Vue({
  el: '#app',
  created: function() {
    this.refresh()
  },
  data: function() {
    return {
      'filterSelected': 'all',
      'folders': [],
      'feeds': [],
      'feedSelected': null,
      'items': [], 
      'itemSelected': null,
      'settings': 'manage',
      'loading': {newfeed: 0},
    }
  },
  computed: {
    foldersWithFeeds: function() {
      var feedsByFolders = this.feeds.reduce(function(folders, feed) {
        if (!folders[feed.folder_id])
          folders[feed.folder_id] = [feed]
        else
          folders[feed.folder_id].push(feed)
        return folders
      }, {})
      var folders = this.folders.slice().map(function(folder) {
        folder.feeds = feedsByFolders[folder.id]
        return folder
      })
      folders.push({id: null, feeds: feedsByFolders[null]})
      return folders
    },
    feedsById: function() {
      return this.feeds.reduce(function(acc, feed) { acc[feed.id] = feed; return acc }, {})
    },
    itemsById: function() {
      return this.items.reduce(function(acc, item) { acc[item.id] = item; return acc }, {})
    },
  },
  watch: {
    'feedSelected': function(newVal, oldVal) {
      if (newVal === null) return
      var vm = this
      var parts = newVal.split(':', 2)
      var type = parts[0]
      var guid = parts[1]
      if (type === 'feed') {
        api.feeds.list_items(guid).then(function(items) {
          vm.items = items
        })
      }
    },
    'itemSelected': function(newVal, oldVal) {
      this.itemSelectedDetails = this.itemsById[newVal]
    },
  },
  methods: {
    refresh: function() {
      var vm = this
      Promise
        .all([api.folders.list(), api.feeds.list()])
        .then(function(values) {
          vm.folders = values[0]
          vm.feeds = values[1]
        })
    },
    toggleFolderExpanded: function(folder) {
      folder.is_expanded = !folder.is_expanded
    },
    formatDate: function(datestr) {
      return new Date(datestr).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})
    },
    moveFeed: function(feed, folder) {
      var folder_id = folder ? folder.id : null
      api.feeds.update(feed.id, {folder_id: folder_id}).then(function() {
        feed.folder_id = folder_id
      })
    },
    createFolder: function(event) {
      var form = event.target
      var titleInput = form.querySelector('input[name=title]')
      var data = {'title': titleInput.value}
      var vm = this
      api.folders.create(data).then(function(result) {
        vm.folders.push(result)
        titleInput.value = ''
      })
    },
    renameFolder: function(folder) {
      var newTitle = prompt('Enter new title', folder.title)
      if (newTitle) {
        api.folders.update(folder.id, {title: newTitle}).then(function() {
          folder.title = newTitle
        })
      }
    },
    deleteFolder: function(folder) {
      var vm = this
      if (confirm('Are you sure you want to delete ' + folder.title + '?')) {
        api.folders.delete(folder.id).then(function() {
          vm.refresh()
        })
      }
    },
    renameFeed: function(feed) {
      var newTitle = prompt('Enter new title', feed.title)
      if (newTitle) {
        api.feeds.update(feed.id, {title: newTitle}).then(function() {
          feed.title = newTitle
        })
      }
    },
    deleteFeed: function(feed) {
      if (confirm('Are you sure you want to delete ' + feed.title + '?')) {
        var vm = this
        api.feeds.delete(feed.id).then(function() {
          api.feeds.list().then(function(feeds) {
            vm.feeds = feeds
          })
        })
      }
    },
    createFeed: function(event) {
      var form = event.target
      var data = {
        url: form.querySelector('input[name=url]').value,
        folder_id: parseInt(form.querySelector('select[name=folder_id]').value) || null,
      }
      this.loading.newfeed = true
      var vm = this
      api.feeds.create(data).then(function(result) {
        if (result.status === 'success') {
          api.feeds.list().then(function(feeds) {
            vm.feeds = feeds
          })
          vm.$bvModal.hide('settings-modal')
        }
        vm.loading.newfeed = false
      })
    },
  }
})
