set_gvm:
	/bin/bash $(GVM_ROOT)/scripts/env/use go1.9

install: set_gvm
	wgo restore

.ONESHELL:
build_js:
	cd ../client/
	yarn build

bind_data: build_js set_gvm
	go-bindata-assetfs -o src/assets/bindata.go -pkg assets ../client/dist/ ../client/index.html ../client/favicon.ico

build: bind_data
	env GOOS=linux GOARCH=amd64 wgo install simpleci
