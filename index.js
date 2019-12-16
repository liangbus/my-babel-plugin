const _ = require('lodash')
const defaultOptions = {
  removeDebugger: true, // 移除 debugger
  removeConsole: true, // 移除 console 对象
  removeAlert: true, // 移除 alert
  debugFn: '' // 移除调试函数
}

module.exports = function({ types: t}) {
  return {
    visitor: {
      // 调试内容
      DebuggerStatement(path, state) {
        console.log('DebuggerState path >>> ', path);
        if(!state) return
        // console.log('DebuggerState ast body >>> ', _.get(state, 'file.ast.program.body'));
        // 插件启动参数
        if(!state.opts) {
          state.opts = defaultOptions
        }
        // 若无传参，则使用默认值
        if(typeof state.opts.removeDebugger === 'undefined') {
          state.opts.removeDebugger = defaultOptions.removeDebugger
        }
        if(state.opts.removeDebugger) {
          path.remove()
        }
        // console.log(t.isDebuggerStatement())
        
      },
      // 判断表达式
      BinaryExpression(path, state) {
        // console.log('In BinaryExpression state>> ', state)
        // console.log('BinaryExpression state.opts >>> ', state.opts);
        if(path.node.operator !== '===') {
          return;
        }
        // console.log('t >>> ', t)
        path.node.left = t.identifier('foolish')
        // 检查节点是否为某种特定类型
        // if(t.isIdentifier(path.node.left, { name: 'n'})) {
        //   // path.node.left = t.identifier('nnn')
        // }
        // // 检查标识符是否正在被引用着
        // if(t.isReferenced(path.node, path.parent)){
        // }
      },
      // 表达式语句
      ExpressionStatement(path, state) {
        if(!state) return
        // 若无传参，则使用默认值
        if(typeof state.opts === 'undefined') {
          state.opts = defaultOptions
        }
        if(typeof state.opts.removeConsole === 'undefined') {
          state.opts.removeConsole = defaultOptions.removeConsole
        }
        // console.log('ExpressionStatement path.node >>> ', _.get(path, 'node'));
        // 清除 console 对象执行语句
        if(_.get(path, 'node.expression.callee.type') === 'MemberExpression' &&
            _.get(path, 'node.expression.callee.object.name') === 'console' &&
            state.opts.removeConsole) {
          path.remove()
        }
        // console.log('path.node >>> ', _.get(path, 'node'))
        // 移除 alert
        if(_.get(path, 'node.expression.type') === 'CallExpression' &&
            _.get(path, 'node.expression.callee.name') === 'alert' &&
            state.opts.removeAlert) {
          path.remove()
        }
        // return
      },
      // AST 中的返回语句执行函数
      ReturnStatement(path, state) {
        // console.log('ReturnStatement state >> ', state)
        // path.replaceWithMultiple([
        //   t.expressionStatement(t.stringLiteral("Is this the real life?")),
        //   t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
        //   t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
        // ]);
      },
      // 函数声明
      FunctionDeclaration(path, state) {
        console.log('path.node >>>>>> ', _.get(path, 'node'))
        if(!state || !state.opts || !state.opts.debugFn) return
        // path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
        // path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
        // 删除指定的调试函数
        if(_.get(path, 'node.id.type') === 'Identifier' && _.get(path, 'node.id.name') === state.opts.debugFn) {
          path.remove()
        }
      },
      VariableDeclarator(path, state) {
        // 指定调试函数调用处删除
        if(_.get(path, 'node.init.type') === 'CallExpression' && _.get(path, 'node.init.callee.name') === state.opts.debugFn) {
          path.remove()
        }
      }
    }
  }
}