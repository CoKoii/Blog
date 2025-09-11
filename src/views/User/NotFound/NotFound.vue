<script setup lang="ts"></script>

<template>
  <div class="NotFound">
    <img loading="lazy" src="../../../assets/NotFound.svg" alt="" />
    <h2>404 Not Found</h2>
    <h3>The page you're looking for doesn't exist or has been moved.</h3>
    <router-link to="/">Return Home</router-link>
  </div>
</template>

<style scoped lang="scss">
.NotFound {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  color: #000;
  padding: 24px;
  filter: var(--filter);
  img {
    width: 80vw;
    max-width: 600px;
    margin-top: -250px;
  }
  h2 {
    font-size: 40px;
  }
  h3 {
    font-size: 20px;
    margin-top: 20px;
    text-align: center;
  }
  a {
    display: flex;
    align-self: center;
    justify-content: center;
    margin-top: 30px;
    background-color: #000;
    font-weight: 900;
    padding: 16px 24px;
    border-radius: 10px;
    font-size: 18px;
    color: #fff;
    transition: all 0.3s ease;
  }
}
</style>
