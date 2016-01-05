# fis-preprocessor-layout
A processor for fis to extends layout template.

## When do you need this plugin ?
如果你采用的是实现了[模板语法糖扩展](https://github.com/fex-team/fis3-solutions/blob/master/intro.md#模板语法糖扩展)的fis解决方案，如[fis3-smarty](https://github.com/fex-team/fis3-smarty)，[jello](https://github.com/fex-team/jello)，[yog2](https://github.com/fex-team/yog2)等，你完全用不到这个插件。但是如果你采用的是基于fis的纯前端解决方案或者虽然是后端渲染但是并没有实现相应的模版语法扩展，还想实现类似于PHP Smarty，Python Django以及Jade中模版的继承机制，来实现减少html书写，专注业务逻辑的效果，那么这个插件很可能适合你。

## How to use ?
```
npm install fis-preprocessor-layout --save
```

fis-conf.js

``` javascript
fis.match('*.html', {
    preprocessor: require('../index')
});
```

以下面的目录结构为例

```
.
├── fis-conf.js
├── index
│   ├── index.css
│   ├── index.html
│   └── index.js
└── layout
    ├── layout.css
    ├── layout.html
    └── layout.js
```

layout.html

``` html
<!DOCTYPE html>
<html>
<head>
    <title>
        <!-- block title -->
        <!-- endblock -->
    </title>

    <link rel="stylesheet" href="./layout.css">
    <!-- block head -->
    <!-- endblock -->
</head>
<body>
    <div>Header</div>

    <!-- block body -->
    <!-- endblock -->

    <div>Footer</div>

    <script src="./layout.js"></script>
    <!-- block script -->
    <!-- endblock -->
</body>
</html>
```

index.html

``` html
<!-- extends "../layout/layout.html" -->

<!-- block title -->
     Demo
<!-- endblock -->

<!-- block head -->
    <link rel="stylesheet" href="./index.css" />
<!-- endblock -->

<!-- block body -->
    <div class="content">Hello World!</div>
<!-- endblock -->

<!-- block script -->
    <script src="./index.js"></script>
<!-- endblock -->
```

released index.html

``` html
<!DOCTYPE html>
<html>
<head>
    <title>
        
     Demo

    </title>

    <link rel="stylesheet" href="/layout/layout.css">
    
    <link rel="stylesheet" href="/index/index.css" />

</head>
<body>
    <div>Header</div>

    
    <div class="content">Hello World!</div>


    <div>Footer</div>

    <script src="/layout/layout.js"></script>
    
    <script src="/index/index.js"></script>

</body>
</html>
```

## View Example
``` 
git clone https://github.com/vicerwang/fis-preprocessor-layout
cd example
npm install fis3 -g
fis3 server start
fis3 release
open http://127.0.0.1:8080/index/
```

## Note
* fis-preprocessor-layout采用注释作为block区域的占位符，基本上是不会和你所用模版的语法产生冲突。
* 编写layout.html时，通过标签的`src`，`href`属性引用的资源以相对layout.html的路径书写即可，对于`<style>.img { background-img: url(some.png); }</style>`或者`<div style="background-img:url(some.png);"></div>`等情况，请使用绝对路径。


