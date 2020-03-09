```
$ npm start -- --help
Usage: index [options] url

Options:
  -v, --ver        output the version number
  --dry            dry run
  --extension <s>  specify extension(s) (default: "pdf,zip")
  --phrase <s>     specify included phrase
  -h, --help       output usage information
```
```
$ npm start -- https://foo.com
download 'https:/foo.com/bar.zip' to 'foo.com/bar.zip'
downloading...
download 'https:/foo.com/baz.pdf' to 'foo.com/baz.pdf'
downloading...
downloaded 2 file(s)
```