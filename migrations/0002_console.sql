create table if not exists consoles (
  user_id text primary key,
  running boolean not null default false,
  running_since timestamptz,
  stopped_since timestamptz,
  mode text not null default 'auto',
  trade_amount_eth double precision not null default 0.8,
  trailing_stop_pct double precision not null default 15,
  daily_timer_on boolean not null default false,
  daily_timer_start text not null default '09:30',
  daily_timer_end text not null default '17:00',
  graduated_approval boolean not null default false,
  token_age_minutes integer not null default 10,
  max_trade_pct double precision not null default 80,
  polling_seconds integer not null default 8,
  wallet_eth double precision not null default 1.284,
  eth_usd double precision not null default 3360,
  detected_name text,
  detected_address text,
  detected_at timestamptz,
  detected_graduated boolean,
  detected_age_minutes integer,
  position_name text,
  position_address text,
  position_bought_at timestamptz,
  position_entry_eth double precision,
  position_peak_eth double precision,
  pending_action text,
  pending_hash text,
  pending_at timestamptz,
  pending_name text,
  pending_address text,
  pending_amount_eth double precision,
  last_error text,
  created_at timestamptz not null default now()
);

create table if not exists telegram_chats (
  id serial primary key,
  user_id text not null,
  chat_id text not null,
  name text,
  created_at timestamptz not null default now()
);

create index if not exists telegram_chats_user_id_idx on telegram_chats (user_id);
