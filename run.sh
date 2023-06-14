#!/bin/bash
deno run \
--allow-net \
--allow-read="/home/node_modules,/node_modules,/home/user/node_modules,relayer.db,relayer.db-journal,/etc/alpine-release,.env,.env.defaults,.env.example" \
--allow-write="relayer.db,relayer.db-journal" \
--allow-ffi="/home/user/node_modules" \
--allow-env \
app.ts

