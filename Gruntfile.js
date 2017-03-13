
module.exports=function(grunt){

	// LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    // 使用connect-livereload模块，生成一个与LiveReload脚本
    
    // <script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
    var lrSnippet = require('connect-livereload')({ port: lrPort });
    // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
 	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var lrMiddleware = function(connect, options, middlwares) {
	  return [
	    lrSnippet,
	    // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
	    serveStatic(options.base[0]),
	    // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
	    serveIndex(options.base[0])
	  ];
};


// 任务配置，所有插件的配置信息
grunt.initConfig({

	// 获取package.json的信息
	pkg:grunt.file.readJSON('package.json'),
	
	// 通过connect任务，创建一个静态服务器
    connect: {
      options: {
        // 服务器端口号
        port: 8000,
        // 服务器地址(可以使用主机名localhost，也能使用IP)
        hostname: 'localhost',
        // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
        base: '.'
      },
      livereload: {
        options: {
          // 通过LiveReload脚本，让页面重新加载。
          middleware: lrMiddleware
        }
      }
    }, 


	// uglify代码压缩插件的配置信息
	uglify: {
		options: {
			stripBanners:true,
			banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
		build: {
			src:'build/built.js',
			dest:'build/min.js'  //输出压缩过代码
		}
	},

	// js代码语法错误检测
	// jshint:{
	// 	options:{
	// 		jshintrc:'.jshintrc' 
	// 		//检测JS代码错误要根据此文件的设置规范进行检测，可以自己修改规则
	// 	},
	// 	build:['Gruntfile.js','src/*.js']//这里填需要检测代码错误的JS文件
	// },

	// js文件合并配置
	concat: {
		options: {
			//文件内容的分隔符
			separator: ';',
			stripBanners: true,
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
		dist: {
			src: ['src/*.js',
				  'src/components/*.js',
				  'src/components/cart/*.js',
				  'src/controllers/*.js',
				  'src/filters/*.js',
			], //合并此目录下所有文件
			dest: 'build/built.js' //之后存放在build目录下并命名为built.js
		}
	},

	// 事件监听配置
	watch:{
		build:{
			//分别监控目录下的所有JS和css
			files:['css/*.css',
					'src/components/*.js',
					'src/components/cart/*.js',
					'src/controllers/*.js',
					'src/filters/*.js',
					'build/built.js',
					'src/*.html',
					'src/views/*.html',
					],
			//不管JS还是CSS有变动按此顺序执行一边
			tasks:['concat','uglify','connect'],
			options:{
				spawn:false,
				livereload: lrPort
			}
		}
	}

	});

	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default',['uglify','concat','connect','watch']);
};   