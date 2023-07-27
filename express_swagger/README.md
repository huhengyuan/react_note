### express集成swagger步骤

#### 1. 安装swagger需要的相关依赖包swagger-ui-express 和 swagger-jsdoc ：
```
    npm i swagger-ui-express
    npm i swagger-jsdoc
```
#### 2. 配置swagger文件：./utils/swaggers/index.js
#### 3. 在启动文件app.js中注册swagger
```
    const swaggerInstall = require("./utils/swaggers");
    swaggerInstall(app);
```
#### 4. 接口上使用注解配置信息 --<>-- express_swagger\routes\user.js