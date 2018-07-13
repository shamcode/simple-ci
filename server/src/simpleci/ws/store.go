package ws

type Store struct {
	chainWatchers map[int]map[*Connection]struct{}
}
