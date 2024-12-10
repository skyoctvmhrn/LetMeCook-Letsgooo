# Gunakan image Node.js resmi sebagai base image
FROM node:18-slim

# Tentukan direktori kerja dalam container
WORKDIR /usr/src/app

ENV HOST 0.0.0.0

# Salin package.json dan package-lock.json ke container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari aplikasi ke dalam container
COPY . .

ENV PORT=3000
ENV JWT_SECRET=adjkfgjhdfjdfhdbfhdsdhbfhdv
ENV DB_HOST=34.34.219.15
ENV DB_NAME=letmecook
ENV DB_USER=letmecook
ENV DB_PASS=letmecook

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/app.js"]
