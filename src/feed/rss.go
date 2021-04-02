// Parser for RSS versions:
// - 0.91 netscape
// - 0.91 userland
// - 2.0
package feed

import (
	"encoding/xml"
	"fmt"
	"io"
)

type rssFeed struct {
	XMLName xml.Name  `xml:"rss"`
	Version string    `xml:"version,attr"`
	Title   string    `xml:"channel>title"`
	Link    string    `xml:"channel>link"`
	Items   []rssItem `xml:"channel>item"`
}

type rssItem struct {
	GUID           string         `xml:"guid"`
	Title          string         `xml:"title"`
	Link           string         `xml:"link"`
	Description    string         `xml:"rss description"`
	PubDate        string         `xml:"pubDate"`
	EnclosureLinks []rssEnclosure `xml:"enclosure"`

	DublinCoreDate string `xml:"http://purl.org/dc/elements/1.1/ date"`
	ContentEncoded string `xml:"http://purl.org/rss/1.0/modules/content/ encoded"`

	FeedBurnerLink          string `xml:"http://rssnamespace.org/feedburner/ext/1.0 origLink"`
	FeedBurnerEnclosureLink string `xml:"http://rssnamespace.org/feedburner/ext/1.0 origEnclosureLink"`

	ItunesSubtitle    string `xml:"http://www.itunes.com/dtds/podcast-1.0.dtd subtitle"`
	ItunesSummary     string `xml:"http://www.itunes.com/dtds/podcast-1.0.dtd summary"`
	GoogleDescription string `xml:"http://www.google.com/schemas/play-podcasts/1.0 description"`
}

type rssLink struct {
	XMLName xml.Name
	Data    string `xml:",chardata"`
	Href    string `xml:"href,attr"`
	Rel     string `xml:"rel,attr"`
}

type rssTitle struct {
	XMLName xml.Name
	Data    string `xml:",chardata"`
	Inner   string `xml:",innerxml"`
}

type rssEnclosure struct {
	URL    string `xml:"url,attr"`
	Type   string `xml:"type,attr"`
	Length string `xml:"length,attr"`
}

func ParseRSS(r io.Reader) (*Feed, error) {
	f := rssFeed{}

	decoder := xml.NewDecoder(r)
	decoder.DefaultSpace = "rss"
	if err := decoder.Decode(&f); err != nil {
		fmt.Println(err)
		return nil, err
	}

	feed := &Feed{
		Title:   f.Title,
		SiteURL: f.Link,
	}
	for _, e := range f.Items {
		date, _ := dateParse(first(e.DublinCoreDate, e.PubDate))

		feed.Items = append(feed.Items, Item{
			GUID:       first(e.GUID, e.Link),
			Date:       date,
			URL:        e.Link,
			Title:      e.Title,
			Content:    e.Description,
		})
	}
	return feed, nil
}
