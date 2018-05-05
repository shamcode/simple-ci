package main

import (
	"gopkg.in/gcfg.v1"
	"log"
)

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

func loadConfiguration() Config {
	var cfg Config
	err := gcfg.ReadFileInto(&cfg, "config.cfg")
	if err != nil {
		log.Fatal(err)
	}
	return cfg
}
