package ws

import (
	log "github.com/sirupsen/logrus"
)
type chainWatcherStore map[int]map[*Connection]struct{}

type store struct {
	chainWatchers chainWatcherStore
}

var Store *store

func (store *store) addChainWatcher(chainID int, conn *Connection) {
	if _, ok := store.chainWatchers[chainID]; !ok {
		store.chainWatchers[chainID] = make(map[*Connection]struct{})
	}
	store.chainWatchers[chainID][conn] = struct{}{}
	log.WithField("connectionID", conn.ID()).WithField("chainID", chainID).Info("add connection to chain watchers store")
}

func (store *store) removeChain(chainID int) {
	log.WithField("chainID", chainID).Info("remove chain from chain watchers store")
	delete(store.chainWatchers, chainID)
}

func (store *store) removeConnection(conn *Connection) {
	log.WithField("connectionID", conn.ID()).Info("remove connection from chain watchers store")
	for _, connections := range store.chainWatchers {
		delete(connections, conn)
	}
}

func InitStore() {
	Store = &store{
		chainWatchers: make(chainWatcherStore),
	}
}
