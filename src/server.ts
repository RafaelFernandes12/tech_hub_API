import { fastify } from "fastify"
import { products } from "./routes/products"
import { sells } from "./routes/sells"
const app = fastify()
const port = 3333

app.register(products)
app.register(sells)

app.listen({
  port
}).then(() => {
  console.log("server is running")
}
)