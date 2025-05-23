
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import CustomProgress from '@/components/ui/CustomProgress';
import { User, Trophy, Calendar, Award, Target, Settings, Flag, Crown, BookOpen, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserData, getAchievements } from '@/services/learningService';
import { User as UserType, Achievement } from '@/types/learning';

const Profile = () => {
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Get user data and achievements from the learning service
    const user = getUserData();
    const achievementsData = getAchievements();
    
    setUserData(user);
    setAchievements(achievementsData);
    setLoaded(true);
  }, []);

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case "Flag": return <Flag className="h-5 w-5" />;
      case "BookOpen": return <BookOpen className="h-5 w-5" />;
      case "Award": return <Award className="h-5 w-5" />;
      case "Crown": return <Crown className="h-5 w-5" />;
      case "MessageSquare": return <MessageSquare className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <section className={cn(
          "transition-all duration-700 transform",
          loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          {userData && (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column - User profile */}
              <div className="w-full md:w-1/3">
                <div className="glass-card rounded-xl p-6 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-6 mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-ocean-deep">
                      {userData.username}
                    </h2>
                    <div className="flex items-center mt-2 text-ocean-deep/70">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">Joined {userData.joinedDate}</span>
                    </div>
                    
                    <div className="mt-6 w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-ocean-deep/70">Level {userData.level}</span>
                        <span className="text-sm text-ocean-deep/70">{userData.xp} XP</span>
                      </div>
                      <CustomProgress 
                        value={userData.xp % 500} 
                        max={500} 
                        size="md" 
                        animated 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-ocean-deep">Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-ocean-deep/70">Current Streak</span>
                        <span className="font-medium text-ocean-deep flex items-center">
                          <Crown className="h-4 w-4 mr-1 text-sand-deep" />
                          {userData.streak} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ocean-deep/70">Words Learned</span>
                        <span className="font-medium text-ocean-deep">
                          {userData.wordsLearned}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ocean-deep/70">Lessons Completed</span>
                        <span className="font-medium text-ocean-deep">
                          {userData.lessonsCompleted}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ocean-deep/70">Quizzes Taken</span>
                        <span className="font-medium text-ocean-deep">
                          {userData.quizzesTaken}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-secondary/50">
                    <button className="w-full flex items-center justify-center py-2 px-4 border border-secondary rounded-lg text-ocean-deep/70 hover:bg-secondary/50 transition">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right column - Achievements */}
              <div className="w-full md:w-2/3">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-ocean-deep">
                      Achievements
                    </h2>
                    <div className="text-ocean-deep/70">
                      <Trophy className="h-5 w-5 inline-block mr-1" />
                      <span>{achievements.filter(a => a.completed).length}/{achievements.length} Unlocked</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "border rounded-lg p-4 transition-all",
                          achievement.completed 
                            ? "bg-primary/5 border-primary/20" 
                            : "bg-white/50 border-secondary"
                        )}
                      >
                        <div className="flex items-start">
                          <div className={cn(
                            "p-2 rounded-lg mr-4",
                            achievement.completed ? "bg-primary/10" : "bg-secondary"
                          )}>
                            {getIconComponent(achievement.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={cn(
                                  "font-semibold",
                                  achievement.completed ? "text-primary" : "text-ocean-deep"
                                )}>
                                  {achievement.title}
                                </h3>
                                <p className="text-sm text-ocean-deep/70 mt-1">
                                  {achievement.description}
                                </p>
                              </div>
                              {achievement.completed && (
                                <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                  Completed
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              <CustomProgress 
                                value={achievement.progress} 
                                max={100}
                                size="sm"
                                color={achievement.completed ? "primary" : "ocean"}
                                showValue
                              />
                            </div>
                            
                            {achievement.date && (
                              <div className="mt-2 text-xs text-ocean-deep/60">
                                Earned {achievement.date}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
