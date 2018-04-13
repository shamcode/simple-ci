# Deps install
```
wgo get github.com/jteeuwen/go-bindata/...
wgo get github.com/elazarl/go-bindata-assetfs/...
wgo get github.com/julienschmidt/httprouter
wgo get github.com/sirupsen/logrus
```

# Build
Build client before
```
gvm use go1.8
go-bindata-assetfs -o src/assets/bindata.go -pkg assets ../client/dist/ ../client/index.html ../client/favicon.ico
wgo install simpleci
```
