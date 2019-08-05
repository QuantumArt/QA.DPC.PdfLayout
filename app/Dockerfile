FROM node:10-alpine

WORKDIR /app
COPY . .
RUN npm install --only=production
RUN mkdir /workdir
RUN mkdir -p /var/log/pdfgenerator
RUN mkdir -p /output

ENV NODE_ENV=production
ENV WORKDIR_PATH=/workdir
ENV LOGS_PATH=/var/log/pdfgenerator
ENV OUTPUT_PATH=/output

EXPOSE 3000
CMD ["node", "server.js"]

