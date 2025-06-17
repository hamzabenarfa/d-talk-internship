#!/bin/sh
set -e


# Only run first-time setup once
if [ ! -f /.initialized ]; then
  echo "First-time setup..."
  npx prisma migrate dev
  npx prisma generate
  npm run seed
  npm run admin
  touch /.initialized
else
  echo "Skipping first-time setup."
fi

exec npm run dev