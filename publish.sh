#!/bin/sh

git clone -b doc-branch-publish https://github.com/openfisca/openfisca.org.git
mv _book doc
rm -rf openfisca.org/doc
mv doc openfisca.org/doc
cd openfisca.org
git add .
git config --global user.name "OpenFisca-Bot"
git config --global user.email "contact@openfisca.fr"
git commit -m "Push from openfisca doc"
git push https://github.com/openfisca/openfisca.org.git doc-branch-publish
if git status -uno ; then
	echo "There was an issue pushing to openfisca.org"
    exit 1
fi