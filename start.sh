#!/bin/sh

set -eu

npx prisma migrate deploy
exec npm run dev -- --hostname 0.0.0.0
