import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('monthly');
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchEvents();
    }
  }, [session]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={() => setView(view === 'weekly' ? 'monthly' : 'weekly')}
          style={{
            padding: '8px 16px',
            background: 'rgba(100, 160, 220, 0.2)',
            border: '1px solid rgba(100, 160, 220, 0.4)',
            borderRadius: '4px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
          }}
        >
          {view === 'weekly' ? 'Monthly View' : 'Weekly View'}
        </button>
        <button
          onClick={() => setShowEventModal(true)}
          style={{
            padding: '8px 16px',
            background: 'rgba(100, 160, 220, 0.8)',
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
          }}
        >
          + New Event
        </button>
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
          }}
        >
          Sign Out
        </button>
      </div>

      {view === 'weekly' ? (
        <WeeklyView
          events={events}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
        />
      ) : (
        <MonthlyView
          events={events}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
        />
      )}

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onSave={async (eventData) => {
            if (selectedEvent) {
              await supabase
                .from('events')
                .update(eventData)
                .eq('id', selectedEvent.id);
            } else {
              await supabase
                .from('events')
                .insert([{ ...eventData, user_id: session.user.id }]);
            }
            fetchEvents();
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onDelete={async () => {
            if (selectedEvent) {
              await supabase
                .from('events')
                .delete()
                .eq('id', selectedEvent.id);
              fetchEvents();
            }
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}

function EventModal({ event, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startTime, setStartTime] = useState(
    event?.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    event?.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ''
  );
  const [color, setColor] = useState(event?.color || '#4a90e2');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      color
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        background: '#2a2a2a',
        padding: '32px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#ffffff'
        }}>
          {event ? 'Edit Event' : 'New Event'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '60px',
                height: '36px',
                padding: '2px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            {event && (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(220, 53, 69, 0.2)',
                  border: '1px solid rgba(220, 53, 69, 0.4)',
                  borderRadius: '4px',
                  color: '#ff6b6b',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginRight: 'auto'
                }}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: 'rgba(100, 160, 220, 0.8)',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
