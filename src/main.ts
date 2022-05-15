import './style.css'
import {inc} from "../mdn/utils";

const app = document.querySelector<HTMLDivElement>('#app')!

const value = inc(10)

console.log('value:', value)

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
