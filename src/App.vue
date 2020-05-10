<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
function getUrlRouter(){
  var arrUrl = window.location.href.split('//')
  var start = arrUrl[1].indexOf('/')
  var relUrl = arrUrl[1].substring(start)
  if (relUrl.indexOf('?') !== -1) {
	relUrl = relUrl.split('?')[0]
  }
  if(relUrl.indexOf('#') !== -1){
	relUrl = relUrl.split('#')[1]
  }
  return relUrl
}
window.addEventListener("beforeunload", () => {
	localStorage.setItem('lastRouter',getUrlRouter());
})
</script>
