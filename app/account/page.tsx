'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../../components/shared/button';
import Image from 'next/image';
import { UserCircle, Coins, Ghost, Clock, Calendar, LogIn, ShoppingCart, Users } from 'lucide-react';

interface PlayerProfileProps {
  nickname: string;
  privilege: string | null;
  privilegeExpiration: string | null;
  position: string | null;
  playTime: string;
  coins: number;
  souls: number;
  balance: number;
  registrationDate: string;
  lastLogin: string;
  lastPurchase: string | null;
  onlinePlayers: number;
  totalPlayers: number;
}

interface Props extends PlayerProfileProps {
  className?: string;
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

// Отдельный компонент для информационной карточки
const InfoCard: React.FC<InfoCardProps> = ({ title, children, className }) => (
  <div className={cn("bg-slate-700 rounded-xl p-6 shadow-md transition-all hover:shadow-lg hover:bg-slate-600", className)}>
    <h2 className="text-2xl font-semibold text-gray-200 mb-4 border-b border-slate-500 pb-2">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}

// Компонент для отдельной строки с информацией
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-center text-lg">
    {icon && <span className="text-blue-400 mr-3">{icon}</span>}
    <span className="text-gray-300 mr-2">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export const UserProfile: React.FC<Props> = ({
  className,
  nickname = 'lethimcook',
  privilege = 'Нет привилегий',
  privilegeExpiration = '---',
  position = 'Администратор',
  playTime = '0 ч',
  coins = 0,
  souls = 0,
  balance = 0.0,
  registrationDate = '---',
  lastLogin = '---',
  lastPurchase = '---',
  onlinePlayers = 0,
  totalPlayers = 0,
}) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [linkedNickname, setLinkedNickname] = useState<string>('');

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNicknameLink = () => {
    if (!linkedNickname.trim()) return;
    console.log(`Linking nickname: ${linkedNickname}`);
    // Здесь можно добавить логику обработки привязки
  };

  const getPrivilegeColor = (priv: string | null): string => {
    if (!priv || priv === 'Нет привилегий') return 'text-gray-400';
    return 'text-green-400';
  };

  const getPositionColor = (pos: string | null): string => {
    if (!pos) return '';
    if (pos.toLowerCase().includes('админ')) return 'text-red-400';
    if (pos.toLowerCase().includes('модер')) return 'text-orange-400';
    return 'text-blue-400';
  };

  return (
    <div className={cn("relative min-h-screen bg-slate-900", className)}>
      
      <main className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white p-8 rounded-xl shadow-xl max-w-6xl mx-auto">
          {/* Верхняя секция с профилем */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-6 border-b border-slate-600">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-slate-600 hover:border-blue-500 transition-all">
              {avatar ? (
                <Image src={avatar} alt="Аватар игрока" layout="fill" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <UserCircle size={64} className="text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <p className="text-white text-sm font-medium">Изменить</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Загрузить аватар"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-100 mb-2">{nickname || 'Неизвестный игрок'}</h1>
              <p className={`text-xl ${getPrivilegeColor(privilege)}`}>
                {privilege} {privilegeExpiration && privilegeExpiration !== '---' ? `(до ${privilegeExpiration})` : ''}
              </p>
              {position && <p className={`text-xl ${getPositionColor(position)}`}>{position}</p>}
            </div>
          </div>

          {/* Сетка с информацией */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Игровая статистика">
              <InfoRow icon={<Clock size={20} />} label="Время игры" value={playTime || '0 ч'} />
              <InfoRow icon={<Coins size={20} />} label="Монеты" value={coins} />
              <InfoRow icon={<Ghost size={20} />} label="Души" value={souls} />
              <InfoRow icon={<Coins size={20} />} label="Баланс" value={`$${balance.toFixed(2)}`} />
            </InfoCard>
            
            <InfoCard title="Информация об аккаунте">
              <InfoRow icon={<Calendar size={20} />} label="Дата регистрации" value={registrationDate || '---'} />
              <InfoRow icon={<LogIn size={20} />} label="Последний вход" value={lastLogin || '---'} />
              {lastPurchase && <InfoRow icon={<ShoppingCart size={20} />} label="Последняя покупка" value={lastPurchase} />}
            </InfoCard>

            <InfoCard title="Статистика сервера">
              <InfoRow icon={<Users size={20} />} label="Онлайн игроков" value={onlinePlayers} />
              <InfoRow icon={<Users size={20} />} label="Всего игроков" value={totalPlayers} />
            </InfoCard>

            <InfoCard title="Привязка аккаунта">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={linkedNickname}
                  onChange={(e) => setLinkedNickname(e.target.value)}
                  placeholder="Введите никнейм"
                  className="bg-slate-800 text-white px-4 py-3 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Button 
                  color='purple'
                  text='Привязать'
                  className='sm:w-32' 
                  onClick={handleNicknameLink}
                />
              </div>
            </InfoCard>
          </div>

          {/* Секция кнопок */}
          <div className="mt-8 bg-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4 border-b border-slate-500 pb-2">Присоединиться к команде</h2>
            <div className="flex flex-wrap gap-4">
              <Button 
                color='green'
                text='💻 Разработчик'
                className='w-full sm:w-auto px-8 py-3 text-lg font-medium'
              />
              <Button 
                color='orange'
                text='🛡️ Модератор'
                className='w-full sm:w-auto px-8 py-3 text-lg font-medium'
              />
              <Button 
                color='blue'
                text='🏗️ Билдер'
                className='w-full sm:w-auto px-8 py-3 text-lg font-medium'
              />
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default UserProfile;