rm -rf "$(git rev-parse --git-dir)/refs/original/"

commit="e5baec97895aa55ff05158045eba45749cc1fbed"
date="1460206861"

git filter-branch --env-filter \
    "if [ \$GIT_COMMIT = '$commit' ]; then
         export GIT_AUTHOR_DATE='$date'
         export GIT_COMMITTER_DATE='$date'
         export GIT_COMMITTER_NAME="\$GIT_AUTHOR_NAME"
         export GIT_COMMITTER_EMAIL="\$GIT_AUTHOR_EMAIL"
     fi"
