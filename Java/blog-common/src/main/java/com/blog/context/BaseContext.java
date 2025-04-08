package com.blog.context;

/**
 * 基础上下文类
 */
public class BaseContext {

    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();  // 线程变量

    public static void setCurrentId(Long id) {
        threadLocal.set(id);
    }     // 设置线程变量

    public static Long getCurrentId() {  // 获取线程变量
        return threadLocal.get();
    }

    public static void removeCurrentId() {
        threadLocal.remove();
    }
}
