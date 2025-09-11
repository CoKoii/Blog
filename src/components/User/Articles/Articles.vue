<script setup lang="ts"></script>

<template>
  <div class="Articles">
    <div class="item" v-for="item in 12" :key="item">
      <div class="img">
        <img
          src="https://oss.zibll.com/zibll.com/2020/11/%E6%8E%A8%E5%B9%BF%E8%AE%A1%E5%88%92.png?x-oss-process=image%2Fquality,q_50%2Fresize,m_fill,w_429,h_300"
          alt=""
        />
        <div class="read_total">30人读过</div>
      </div>
      <div class="info">
        <img class="avatar" src="https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640" alt="" />
        <div class="desc">
          <div class="title">💳 WildCard 虚拟信用卡申请 - 海外 AI 工具充值</div>
          <div class="author">CaoKai</div>
          <div class="arguments">
            <span class="time">2020-11-01</span>
            <span>•</span>
            <span class="tags">标签1</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mask">
      <div class="text">Load More...</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
