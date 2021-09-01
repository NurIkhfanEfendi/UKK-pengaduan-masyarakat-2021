<template>
  <div id="app">
    <div id="wrapper">
      <router-view name="sidebar" />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <router-view name="header"/>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

