import type { LearningPathResponse } from '../types'

export const mockLearningPath: LearningPathResponse = {
  name: '从程序设计基础到数据结构入门的成长路径',
  nodes: [
    { id: 'node-1', name: '函数调用基础', course: '程序设计基础', goal: '理解函数调用机制', duration: '2小时', status: 'pending' },
    { id: 'node-2', name: '数组与循环巩固', course: '程序设计基础', goal: '掌握数组遍历与操作', duration: '3小时', status: 'pending' },
    { id: 'node-3', name: '递归概念与调用栈', course: '程序设计基础', goal: '理解递归思想和调用栈', duration: '4小时', status: 'pending' },
    { id: 'node-4', name: '二叉树结构理解', course: '数据结构与算法', goal: '理解二叉树的结构和性质', duration: '3小时', status: 'pending' },
    { id: 'node-5', name: '二叉树遍历代码实现', course: '数据结构与算法', goal: '掌握遍历方式的代码实现', duration: '4小时', status: 'pending' },
    { id: 'node-6', name: '分层练习与错题修正', course: '数据结构与算法', goal: '练习巩固，修正易错点', duration: '3小时', status: 'pending' },
    { id: 'node-7', name: '文件目录树项目案例', course: '数据结构与算法', goal: '综合应用树结构', duration: '5小时', status: 'pending' },
  ],
}
