const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  const data = {};
  
  console.log('Fetching Users...');
  data.User = await prisma.user.findMany();
  
  console.log('Fetching Day1Data...');
  data.Day1Data = await prisma.day1Data.findMany();
  
  console.log('Fetching Day2Data...');
  data.Day2Data = await prisma.day2Data.findMany();
  
  console.log('Fetching Day3Data...');
  data.Day3Data = await prisma.day3Data.findMany();
  
  console.log('Fetching Day4Data...');
  data.Day4Data = await prisma.day4Data.findMany();
  
  console.log('Fetching Day5Data...');
  data.Day5Data = await prisma.day5Data.findMany();
  
  console.log('Fetching Day6Data...');
  data.Day6Data = await prisma.day6Data.findMany();
  
  console.log('Fetching Day7Data...');
  data.Day7Data = await prisma.day7Data.findMany();

  fs.writeFileSync('database_backup.json', JSON.stringify(data, null, 2));
  console.log('Backup successfully written to database_backup.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
