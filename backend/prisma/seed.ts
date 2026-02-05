import { PrismaClient, Position, GameStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Teams
  console.log('Creating teams...');
  const lakers = await prisma.team.create({
    data: {
      name: 'Lakers',
      city: 'Los Angeles',
      abbreviation: 'LAL',
      conference: 'Western',
      division: 'Pacific',
    },
  });

  const warriors = await prisma.team.create({
    data: {
      name: 'Warriors',
      city: 'Golden State',
      abbreviation: 'GSW',
      conference: 'Western',
      division: 'Pacific',
    },
  });

  const celtics = await prisma.team.create({
    data: {
      name: 'Celtics',
      city: 'Boston',
      abbreviation: 'BOS',
      conference: 'Eastern',
      division: 'Atlantic',
    },
  });

  const heat = await prisma.team.create({
    data: {
      name: 'Heat',
      city: 'Miami',
      abbreviation: 'MIA',
      conference: 'Eastern',
      division: 'Southeast',
    },
  });

  console.log('✓ Teams created');

  // Create Players
  console.log('Creating players...');
  const lebron = await prisma.player.create({
    data: {
      firstName: 'LeBron',
      lastName: 'James',
      position: Position.SF,
      jerseyNumber: 23,
      height: 206,
      weight: 113,
      birthDate: new Date('1984-12-30'),
      teamId: lakers.id,
    },
  });

  const curry = await prisma.player.create({
    data: {
      firstName: 'Stephen',
      lastName: 'Curry',
      position: Position.PG,
      jerseyNumber: 30,
      height: 188,
      weight: 84,
      birthDate: new Date('1988-03-14'),
      teamId: warriors.id,
    },
  });

  const tatum = await prisma.player.create({
    data: {
      firstName: 'Jayson',
      lastName: 'Tatum',
      position: Position.SF,
      jerseyNumber: 0,
      height: 203,
      weight: 95,
      birthDate: new Date('1998-03-03'),
      teamId: celtics.id,
    },
  });

  const butler = await prisma.player.create({
    data: {
      firstName: 'Jimmy',
      lastName: 'Butler',
      position: Position.SF,
      jerseyNumber: 22,
      height: 201,
      weight: 104,
      birthDate: new Date('1989-09-14'),
      teamId: heat.id,
    },
  });

  const davis = await prisma.player.create({
    data: {
      firstName: 'Anthony',
      lastName: 'Davis',
      position: Position.PF,
      jerseyNumber: 3,
      height: 208,
      weight: 115,
      birthDate: new Date('1993-03-11'),
      teamId: lakers.id,
    },
  });

  console.log('✓ Players created');

  // Create Games
  console.log('Creating games...');
  const game1 = await prisma.game.create({
    data: {
      homeTeamId: lakers.id,
      awayTeamId: warriors.id,
      gameDate: new Date('2024-01-15'),
      season: '2023-24',
      homeScore: 112,
      awayScore: 108,
      status: GameStatus.COMPLETED,
    },
  });

  const game2 = await prisma.game.create({
    data: {
      homeTeamId: celtics.id,
      awayTeamId: heat.id,
      gameDate: new Date('2024-01-16'),
      season: '2023-24',
      homeScore: 118,
      awayScore: 114,
      status: GameStatus.COMPLETED,
    },
  });

  console.log('✓ Games created');

  // Create Game Stats
  console.log('Creating game statistics...');
  
  // LeBron's stats for game 1
  await prisma.playerGameStats.create({
    data: {
      playerId: lebron.id,
      gameId: game1.id,
      minutesPlayed: 36.5,
      points: 28,
      fieldGoalsMade: 10,
      fieldGoalsAttempted: 20,
      threePointersMade: 2,
      threePointersAttempted: 6,
      freeThrowsMade: 6,
      freeThrowsAttempted: 8,
      offensiveRebounds: 2,
      defensiveRebounds: 6,
      totalRebounds: 8,
      assists: 9,
      steals: 2,
      blocks: 1,
      turnovers: 3,
      personalFouls: 2,
      plusMinus: 8,
    },
  });

  // Curry's stats for game 1
  await prisma.playerGameStats.create({
    data: {
      playerId: curry.id,
      gameId: game1.id,
      minutesPlayed: 35.0,
      points: 32,
      fieldGoalsMade: 11,
      fieldGoalsAttempted: 22,
      threePointersMade: 6,
      threePointersAttempted: 13,
      freeThrowsMade: 4,
      freeThrowsAttempted: 4,
      offensiveRebounds: 0,
      defensiveRebounds: 5,
      totalRebounds: 5,
      assists: 7,
      steals: 1,
      blocks: 0,
      turnovers: 2,
      personalFouls: 3,
      plusMinus: -4,
    },
  });

  // Anthony Davis stats for game 1
  await prisma.playerGameStats.create({
    data: {
      playerId: davis.id,
      gameId: game1.id,
      minutesPlayed: 34.0,
      points: 24,
      fieldGoalsMade: 9,
      fieldGoalsAttempted: 15,
      threePointersMade: 0,
      threePointersAttempted: 1,
      freeThrowsMade: 6,
      freeThrowsAttempted: 7,
      offensiveRebounds: 4,
      defensiveRebounds: 8,
      totalRebounds: 12,
      assists: 3,
      steals: 1,
      blocks: 3,
      turnovers: 2,
      personalFouls: 4,
      plusMinus: 6,
    },
  });

  // Tatum's stats for game 2
  await prisma.playerGameStats.create({
    data: {
      playerId: tatum.id,
      gameId: game2.id,
      minutesPlayed: 38.0,
      points: 31,
      fieldGoalsMade: 11,
      fieldGoalsAttempted: 21,
      threePointersMade: 4,
      threePointersAttempted: 9,
      freeThrowsMade: 5,
      freeThrowsAttempted: 6,
      offensiveRebounds: 1,
      defensiveRebounds: 7,
      totalRebounds: 8,
      assists: 5,
      steals: 2,
      blocks: 1,
      turnovers: 2,
      personalFouls: 3,
      plusMinus: 7,
    },
  });

  // Butler's stats for game 2
  await prisma.playerGameStats.create({
    data: {
      playerId: butler.id,
      gameId: game2.id,
      minutesPlayed: 37.0,
      points: 27,
      fieldGoalsMade: 9,
      fieldGoalsAttempted: 18,
      threePointersMade: 1,
      threePointersAttempted: 4,
      freeThrowsMade: 8,
      freeThrowsAttempted: 9,
      offensiveRebounds: 2,
      defensiveRebounds: 5,
      totalRebounds: 7,
      assists: 6,
      steals: 3,
      blocks: 0,
      turnovers: 3,
      personalFouls: 2,
      plusMinus: -3,
    },
  });

  console.log('✓ Game statistics created');

  // The season stats and advanced metrics will be automatically calculated
  // when we call the StatsService.updateSeasonStats function
  console.log('Calculating season statistics...');
  
  const { StatsService } = await import('../src/services/stats.service');
  
  await StatsService.updateSeasonStats(lebron.id, '2023-24');
  await StatsService.updateSeasonStats(curry.id, '2023-24');
  await StatsService.updateSeasonStats(davis.id, '2023-24');
  await StatsService.updateSeasonStats(tatum.id, '2023-24');
  await StatsService.updateSeasonStats(butler.id, '2023-24');

  console.log('✓ Season statistics and advanced metrics calculated');

  console.log('\n✅ Database seed completed successfully!');
  console.log('\nCreated:');
  console.log('  - 4 teams');
  console.log('  - 5 players');
  console.log('  - 2 games');
  console.log('  - 5 game stat entries');
  console.log('  - Season stats and advanced metrics for all players');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
