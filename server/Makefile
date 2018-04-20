set_gvm:
	/bin/bash $(GVM_ROOT)/scripts/env/use go1.8

install: set_gvm
	wgo get github.com/jteeuwen/go-bindata/...
	wgo get github.com/elazarl/go-bindata-assetfs/...
	wgo get github.com/julienschmidt/httprouter
	wgo get github.com/sirupsen/logrus

.ONESHELL:
build_js:
	cd ../client/
	yarn build

bind_data: build_js set_gvm
	go-bindata-assetfs -o src/assets/bindata.go -pkg assets ../client/dist/ ../client/index.html ../client/favicon.ico

build: bind_data
	wgo install simpleci