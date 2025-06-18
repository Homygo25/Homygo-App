#!/bin/bash
set -e
sudo apt-get update -y
sudo apt-get install -y \
  php php-cli php-fpm \
  php-curl php-mbstring php-xml
