'use client';

import ErrorPage from '../components/shared/error-section';

export const ServerErrorPage = () => (
  <ErrorPage 
    code="500"
    title="Внутренняя ошибка сервера."
    description="Что-то пошло не так. Пожалуйста, попробуйте позже."
    buttonColor="yellow"
    decorationColors={{
      primary: 'orange-700',
      secondary: 'yellow-600'
    }}
    decorationGradient="from-yellow-500 to-orange-500"
  />
);
  
  export default ServerErrorPage;