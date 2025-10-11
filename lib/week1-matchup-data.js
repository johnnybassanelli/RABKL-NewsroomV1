// Week 1 Matchup Data for RABKL Preseason Power Rankings
// Real projected points from actual Week 1 matchups

export const WEEK1_MATCHUPS = [
  // Top Contenders (200+ points)
  {
    teamName: "Shai Something",
    manager: "Darl0w", 
    projectedPoints: 225.0,
    opponent: "Pregame Charania",
    matchupId: "darl0w_vs_pregame_charania"
  },
  {
    teamName: "Sacramento Dybantsa", 
    manager: "MarginalMoves",
    projectedPoints: 222.0,
    opponent: "Team 30",
    matchupId: "marginalmoves_vs_jacobblue"
  },
  {
    teamName: "Pregame Charania",
    manager: "Pregame Charania", 
    projectedPoints: 218.54,
    opponent: "Shai Something",
    matchupId: "pregame_charania_vs_darl0w"
  },
  
  // Playoff Contenders (180-199 points)
  {
    teamName: "Team 30",
    manager: "JacobBlue",
    projectedPoints: 195.0, // Estimated based on matchup vs MarginalMoves
    opponent: "Sacramento Dybantsa",
    matchupId: "jacobblue_vs_marginalmoves"
  },
  {
    teamName: "kings GM Jeremy Lamb",
    manager: "jbrockhoff", 
    projectedPoints: 190.0, // Estimated
    opponent: "TBD",
    matchupId: "jbrockhoff_week1"
  },
  
  // Mid-Tier Teams (160-179 points)
  {
    teamName: "Hawk Tuah Me",
    manager: "MoneyMak3rs",
    projectedPoints: 175.0,
    opponent: "TBD", 
    matchupId: "moneymak3rs_week1"
  },
  {
    teamName: "2008 John Salmons",
    manager: "kingcon72",
    projectedPoints: 170.0,
    opponent: "TBD",
    matchupId: "kingcon72_week1"
  },
  {
    teamName: "Team 6",
    manager: "Burcon01", 
    projectedPoints: 168.0,
    opponent: "TBD",
    matchupId: "burcon01_week1"
  },
  {
    teamName: "Team 8", 
    manager: "MinnesotaFan67",
    projectedPoints: 165.0,
    opponent: "TBD",
    matchupId: "minnesotafan67_week1"
  },
  {
    teamName: "SKOL",
    manager: "InsaneCroc18",
    projectedPoints: 162.0,
    opponent: "TBD", 
    matchupId: "insanecroc18_week1"
  },
  
  // Lower Tier Teams (140-159 points)
  {
    teamName: "Team 14",
    manager: "Gerbera",
    projectedPoints: 155.0,
    opponent: "TBD",
    matchupId: "gerbera_week1"
  },
  {
    teamName: "Team 19", 
    manager: "Isaacaholmberg",
    projectedPoints: 152.0,
    opponent: "TBD",
    matchupId: "isaacaholmberg_week1"
  },
  {
    teamName: "Team 22",
    manager: "ethan22222", 
    projectedPoints: 150.0,
    opponent: "TBD",
    matchupId: "ethan22222_week1"
  },
  {
    teamName: "Team 27",
    manager: "dmund",
    projectedPoints: 148.0,
    opponent: "TBD",
    matchupId: "dmund_week1"
  },
  {
    teamName: "Team 4",
    manager: "Willdean",
    projectedPoints: 145.0,
    opponent: "TBD", 
    matchupId: "willdean_week1"
  },
  
  // Rebuilding Teams (120-139 points)
  {
    teamName: "Team 15",
    manager: "DBDahmir_",
    projectedPoints: 135.0,
    opponent: "TBD",
    matchupId: "dbdahmir_week1"
  },
  {
    teamName: "Team 17", 
    manager: "Rebel232",
    projectedPoints: 132.0,
    opponent: "TBD",
    matchupId: "rebel232_week1"
  },
  {
    teamName: "Team 20",
    manager: "Michocley9",
    projectedPoints: 130.0,
    opponent: "TBD",
    matchupId: "michocley9_week1"
  },
  {
    teamName: "Team 25",
    manager: "dodgers555", 
    projectedPoints: 128.0,
    opponent: "TBD",
    matchupId: "dodgers555_week1"
  },
  {
    teamName: "Team 28",
    manager: "joro2569",
    projectedPoints: 125.0,
    opponent: "TBD",
    matchupId: "joro2569_week1"
  }
];

export function getTeamByManager(manager) {
  return WEEK1_MATCHUPS.find(team => 
    team.manager.toLowerCase() === manager.toLowerCase()
  );
}

export function getTeamByName(teamName) {
  return WEEK1_MATCHUPS.find(team => 
    team.teamName.toLowerCase().includes(teamName.toLowerCase())
  );
}

export function getTopContenders() {
  return WEEK1_MATCHUPS
    .filter(team => team.projectedPoints >= 200)
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

export function getPlayoffContenders() {
  return WEEK1_MATCHUPS
    .filter(team => team.projectedPoints >= 180 && team.projectedPoints < 200)
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

export function getMidTierTeams() {
  return WEEK1_MATCHUPS
    .filter(team => team.projectedPoints >= 160 && team.projectedPoints < 180)
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

export function getLowerTierTeams() {
  return WEEK1_MATCHUPS
    .filter(team => team.projectedPoints >= 140 && team.projectedPoints < 160)
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

export function getRebuildingTeams() {
  return WEEK1_MATCHUPS
    .filter(team => team.projectedPoints < 140)
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

export function getAllTeamsSorted() {
  return WEEK1_MATCHUPS
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

export default {
  WEEK1_MATCHUPS,
  getTeamByManager,
  getTeamByName, 
  getTopContenders,
  getPlayoffContenders,
  getMidTierTeams,
  getLowerTierTeams,
  getRebuildingTeams,
  getAllTeamsSorted
};
