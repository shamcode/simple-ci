# Deps install
```
wgo get github.com/jteeuwen/go-bindata/...
wgo get github.com/elazarl/go-bindata-assetfs/...
```

# Build
Build client before
```
gvm use go1.8
go-bindata-assetfs -o src/simpleci/bindata.go ../client/dist/ ../client/index.html
wgo install simpleci
```
