package main

import (
	"gopkg.in/gcfg.v1"
	"os"
	"github.com/sirupsen/logrus"
	"io/ioutil"
	"strings"
)

const configFilename = "config.cfg"

type Config struct {
	Server struct {
		Port int
	}
	Database DataBaseConfig
}

type DataBaseConfig struct {
	Driver string
	Host   string
	Port   int
	Name   string
	User   string
	Pass   string
}

const defaultConfig = `
[server]
port = 3000

[database]
driver = postgres
host = 127.0.0.1
port = 5432
name = simpleci
user = ciuser
pass = passw0rd
`

func loadConfiguration() Config {
	if _, err := os.Stat(configFilename); os.IsNotExist(err) {
		err := ioutil.WriteFile(configFilename, []byte(strings.TrimSpace(defaultConfig)), 0644)
		if nil != err {
			logrus.WithError(err).Fatal("Fail write config",logrus.Fields{"configFilename": configFilename} )
		} else {
			logrus.Info("Create config file")
		}
	}

	var cfg Config
	err := gcfg.ReadFileInto(&cfg, configFilename)
	if nil != err {
		logrus.WithError(err).Fatal("Fail read config", logrus.Fields{"configFilename": configFilename})
	}
	return cfg
}
