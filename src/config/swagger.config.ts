import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('API')
    .setDescription(
      `### REST

Routes is following REST standard

<details><summary>Detailed specification</summary>
<p>

**Header**

  - API key: api-key: g5?v?-=UAe@8qHXhKa@7hPe$udHv8unV,

  - JWT: authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9....

**Filter:**

  - 時間分隔符號 '-'

  - Example

    - /api/v1/egm/client?page=1&limit=10&sortBy=ip:ASC&filter.ip=192.168.10.105&filter.createdAt=$btw:2022-01-01,2023-02-01&filter.rate=$btw:100,10000&filter.rate=$gte:600 

    - 
      - EQ
        - id, member, token, ticket type, point, createdAt, ip, brand, model, stream_url

      - LTE
        - point, createdAt, rate

      - GTE
        - point, createdAt, rate

      - BTW
        - point, createdAt, rate

**Sort:**
 
  - Egm:

    - ip, rate, createdAt

  - Access:

    - type, point, createdAt



</p>
</details>`,
    )
    .addBearerAuth();

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  setTimeout(() => {
    console.info(
      `Documentation: http://localhost:${process.env.PORT}/documentation`,
    );
  }, 0);
}
