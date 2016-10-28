## ip-manager

> manage your hosts file, just right now!

### install
```
sudo npm install ip-manager -g
```

### examples

#### init
```
ip-manager init
```
**ip-manager will not manage your old hosts**

*If you want ip-manager manage your old hosts,
 you can put your old hosts between the '#ip-manager-start' and '#ip-manager-end',
 and then add '#ip-manager' at the end of each line.*

#### add a hosts line
```
ip-manager add home.xhinliang.com 115.19.85.18
ip-manager add home.xhinliang.com 115.159.85.182
ip-manager add resume.xhinliang.com 115.159.85.12
```

#### show the list of hosts
```
ip-manager list
```

#### enable an ip to a domain
```
ip-manager enable resume 182
ip-manager enable home 18
ip-manager enable list
```

#### search and check status
```
ip-manager status home
```

#### disable all ip to a domain
```
ip-manager diable home
ip-manager list
```

### build
> ip-manager is writen by TypeScript, so you should install `typings` and `TypeScript` if you want to build it.

```
git clone https://github.com/XhinLiang/ip-manager.git
cd ip-manager
npm install
typings install
tsc
```

### license
```
MIT License

Copyright (c) 2016 Xhin Liang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
