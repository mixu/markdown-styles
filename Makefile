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

# Note: on OSX, run brew install ghostscript as well to get the fonts needed for montage
screenshots:
	rm -f ./screenshots/*.jpg
	for name in `find ./output -mindepth 1 -maxdepth 1 -type d | sed -e 's/.\/output\///'` ; do \
		./node_modules/.bin/electroshot $(CURDIR)/output/$$name/index.html 800x600 --format jpg --quality 60 --force-device-scale-factor 1 --filename ./screenshots/$$name.jpg; \
	done
	rm ./screenshots/montage.jpg || true
	montage -tile 4x -label '%t'  -geometry 120x120\>+20+5  ./screenshots/*.jpg  ./screenshots/montage.jpg

montage:
	rm ./screenshots/montage.jpg || true
	montage -tile 4x -label '%t'  -geometry 120x120\>+20+5  ./screenshots/*.jpg  ./screenshots/montage.jpg

.PHONY: build screenshots montage

lint:
	fixjsstyle $(GJSLINT) -r .
	gjslint $(GJSLINT) -r .
	jshint .

.PHONY: lint
