import { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { Dialog, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePlayers } from '@/hooks/use-players';
import { useTeams } from '@/hooks/use-teams';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: players } = usePlayers(undefined, { enabled: open });
  const { data: teams } = useTeams({ enabled: open });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          position: 'fixed',
          top: '20%',
          m: 0,
        },
      }}
    >
      <Command className="cmdk-root" label="Command Palette">
        <Command.Input
          placeholder="Search pages, players, teams..."
          className="cmdk-input"
        />
        <Command.List className="cmdk-list">
          <Command.Empty className="cmdk-empty">No results found.</Command.Empty>

          <Command.Group heading="Pages" className="cmdk-group">
            <Command.Item onSelect={() => handleSelect('/')} className="cmdk-item">
              Dashboard
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/players')} className="cmdk-item">
              Players
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/teams')} className="cmdk-item">
              Teams
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/games')} className="cmdk-item">
              Games
            </Command.Item>
          </Command.Group>

          {players && players.length > 0 && (
            <Command.Group heading="Players" className="cmdk-group">
              {players.slice(0, 8).map((player) => (
                <Command.Item
                  key={player.id}
                  value={`${player.firstName} ${player.lastName}`}
                  onSelect={() => handleSelect(`/players/${player.id}`)}
                  className="cmdk-item"
                >
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <span>{player.firstName} {player.lastName}</span>
                    <Box component="span" sx={{ opacity: 0.5, fontSize: '0.85em' }}>
                      {player.position} {player.team ? `- ${player.team.abbreviation}` : ''}
                    </Box>
                  </Box>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {teams && teams.length > 0 && (
            <Command.Group heading="Teams" className="cmdk-group">
              {teams.slice(0, 6).map((team) => (
                <Command.Item
                  key={team.id}
                  value={`${team.name} ${team.city}`}
                  onSelect={() => handleSelect(`/teams`)}
                  className="cmdk-item"
                >
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <span>{team.name}</span>
                    <Box component="span" sx={{ opacity: 0.5, fontSize: '0.85em' }}>
                      {team.city} - {team.conference}
                    </Box>
                  </Box>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </Dialog>
  );
}
