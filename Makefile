UNAME := $(shell uname)
GJSLINT := --nojsdoc --exclude_directories=node_modules,layouts,output --max_line_length=120 --disable=200,201,202,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,230,231,232,233,250,251,252

build:
	for name in `find ./layouts -mindepth 1 -maxdepth 1 -type d | sed -e 's/.\/layouts\///'` ; do \
		./bin/generate-md --layout $$name --output ./output/$$name/; \
	done

preview:
ifeq ($(UNAME), Linux)
	xdg-open output/index.html
endif
ifeq ($(UNAME), Darwin)
	open output/index.html
endif

# Note: for fonts to render you need to download them first
screenshots: build
	rm -f ./screenshots/*.png
	for name in `find ./output -mindepth 1 -maxdepth 1 -type d | sed -e 's/.\/output\///'` ; do \
				cutycapt --url=file://$(CURDIR)/output/$$name/index.html --out=./screenshots/$$name.png ; \
				convert ./screenshots/$$name.png -resize "800x" -crop 800x600+0+0  +repage ./screenshots/$$name-cropped.png ; \
				rm ./screenshots/$$name.png ; \
				mv ./screenshots/$$name-cropped.png ./screenshots/$$name.png ; \
	done
	rm ./screenshots/montage.png || true
	montage -tile 4x -label '%t'  -geometry 120x120\>+20+5  ./screenshots/*.png  ./screenshots/montage.png

phantomjs:
	rm -f ./screenshots/*.png
	for name in `find ./output -mindepth 1 -maxdepth 1 -type d | sed -e 's/.\/output\///'` ; do \
				phantomjs ./screenshots/screenshot.js --url=file://$(CURDIR)/output/$$name/index.html --out=./screenshots/$$name.png ; \
				convert ./screenshots/$$name.png -resize "800x" -crop 800x600+0+0  +repage ./screenshots/$$name-cropped.png ; \
				rm ./screenshots/$$name.png ; \
				mv ./screenshots/$$name-cropped.png ./screenshots/$$name.png ; \
	done
	rm ./screenshots/montage.png || true
	montage -tile 4x -label '%t'  -geometry 120x120\>+20+5  ./screenshots/*.png  ./screenshots/montage.png

montage:
	rm ./screenshots/montage.png || true
	montage -tile 4x -label '%t'  -geometry 120x120\>+20+5  ./screenshots/*.png  ./screenshots/montage.png

# Download google fonts for cutycapt
get-fonts:
	node screenshots/font-download.js

.PHONY: build screenshots get-fonts montage

lint:
	fixjsstyle $(GJSLINT) -r .
	gjslint $(GJSLINT) -r .
	jshint .

.PHONY: lint
