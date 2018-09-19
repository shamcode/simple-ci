set_gvm:
	/bin/bash $(GVM_ROOT)/scripts/env/use go1.8

install: set_gvm
	wgo restore

.ONESHELL:
build_js:
	cd ../client/
	yarn build

bind_data: build_js set_gvm
	go-bindata-assetfs -o src/assets/bindata.go -pkg assets ../client/dist/ ../client/index.html ../client/favicon.ico

build_386: bind_data
	env GOOS=linux GOARCH=386 wgo install simpleci

build_amd64: bind_data
	env GOOS=linux GOARCH=amd64 wgo install simpleci

build: build_386 build_amd64
