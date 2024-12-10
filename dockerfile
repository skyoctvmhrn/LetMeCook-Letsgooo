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

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/app.js"]
