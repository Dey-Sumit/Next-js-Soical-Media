import express from "express";
import next from "next";
import http from "http";
// const express = require('express')
// const next = require('next')
// const { parse } = require('url')
// const http = require('http')

const dev = process.env.NODE_ENV !== "production";
const app = express();
const server = http.createServer(app);
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const PORT = process.env.PORT || 3000;

nextApp.prepare().then(() => {
  app.all("*", (req, res) => {
    //   const parsedUrl = parse(req.url, true)
    //   const { pathname, query } = parsedUrl

    return handle(req, res);
  });
  server.listen(PORT, (err?:any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
