screenshots:
	rm -f ./screenshots/*.png
	for name in `find ./output -mindepth 1 -maxdepth 1 -type d | sed -e 's/.\/output\///'` ; do \
				capturejs --uri file://$(CURDIR)/output/$$name/index.html  --output ./screenshots/$$name.png ; \
				convert ./screenshots/$$name.png -resize "800x" -crop 800x600+0+0  +repage ./screenshots/$$name-cropped.png ; \
				rm ./screenshots/$$name.png ; \
				mv ./screenshots/$$name-cropped.png ./screenshots/$$name.png ; \
	done

# using cutycapt is easier than installing phantomjs, but you don't get web font support
screenshots-old:
	rm -f ./screenshots/*.png
	for name in `find ./output -mindepth 1 -maxdepth 1 -type d | sed -e 's/.\/output\///'` ; do \
				cutycapt --url=file://$(CURDIR)/output/$$name/index.html --out=./screenshots/$$name.png ; \
				convert ./screenshots/$$name.png -resize "800x" -crop 800x600+0+0  +repage ./screenshots/$$name-cropped.png ; \
				rm ./screenshots/$$name.png ; \
				mv ./screenshots/$$name-cropped.png ./screenshots/$$name.png ; \
	done

.PHONY: screenshots screenshots-old
