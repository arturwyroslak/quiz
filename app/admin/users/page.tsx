'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Plus,
  X
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string | null;
  accountType: string;
  isVerified: boolean;
  isActive: boolean;
  phone: string | null;
  companyName: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const sessionResult = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    email: '',
    name: '',
    accountType: 'PARTNER',
    isActive: true,
    companyName: '',
    phone: ''
  });
  
  // Safe destructuring with fallback
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/partner-program/login');
      return;
    }

    if (session.user.accountType !== 'ADMIN') {
      router.push('/partner-program/dashboard');
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData),
      });

      if (response.ok) {
        await fetchUsers();
        setShowAddForm(false);
        setAddFormData({
          email: '',
          name: '',
          accountType: 'PARTNER',
          isActive: true,
          companyName: '',
          phone: ''
        });
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
      } else {
        console.error('Failed to toggle user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'ALL' || user.accountType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getAccountTypeBadge = (type: string) => {
    const variants = {
      'ADMIN': 'destructive',
      'COMPANY': 'default',
      'PARTNER': 'secondary',
      'TEAM_MEMBER': 'outline'
    };
    
    const labels = {
      'ADMIN': 'Administrator',
      'COMPANY': 'Firma',
      'PARTNER': 'Partner',
      'TEAM_MEMBER': 'Członek zespołu'
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] as any}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie użytkowników...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Zarządzanie użytkownikami</h1>
          <p className="text-[#666666] font-body-regular">Zarządzaj wszystkimi użytkownikami w systemie partnerskim</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj użytkownika
        </Button>
      </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <input
                    type="text"
                    placeholder="Szukaj użytkowników..."
                    className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">Wszystkie typy</option>
                  <option value="ADMIN">Administratorzy</option>
                  <option value="COMPANY">Firmy</option>
                  <option value="PARTNER">Partnerzy</option>
                  <option value="TEAM_MEMBER">Członkowie zespołu</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add User Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-heading-medium text-[#2D2D2D]">Dodaj nowego użytkownika</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={addUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      value={addFormData.name}
                      onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                      Typ konta *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      value={addFormData.accountType}
                      onChange={(e) => setAddFormData({...addFormData, accountType: e.target.value})}
                    >
                      <option value="PARTNER">Partner</option>
                      <option value="COMPANY">Firma</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      value={addFormData.phone}
                      onChange={(e) => setAddFormData({...addFormData, phone: e.target.value})}
                    />
                  </div>
                  
                  {addFormData.accountType === 'COMPANY' && (
                    <div>
                      <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                        Nazwa firmy
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        value={addFormData.companyName}
                        onChange={(e) => setAddFormData({...addFormData, companyName: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={addFormData.isActive}
                      onChange={(e) => setAddFormData({...addFormData, isActive: e.target.checked})}
                      className="w-4 h-4 text-[#D4AF37] border-[#E0E0E0] rounded focus:ring-[#D4AF37]"
                    />
                    <label htmlFor="isActive" className="text-sm font-body-medium text-[#2D2D2D]">
                      Konto aktywne
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                  >
                    Dodaj użytkownika
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Anuluj
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">
              Lista użytkowników ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Zarządzaj kontami użytkowników i ich uprawnieniami
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Użytkownik</TableHead>
                    <TableHead>Typ konta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Data rejestracji</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-body-medium text-[#2D2D2D]">
                            {user.name || 'Brak nazwy'}
                          </p>
                          <p className="text-sm font-body-regular text-[#666666]">
                            {user.email}
                          </p>
                          {user.companyName && (
                            <p className="text-sm font-body-regular text-[#666666]">
                              {user.companyName}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAccountTypeBadge(user.accountType)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Aktywny" : "Nieaktywny"}
                          </Badge>
                          <Badge variant={user.isVerified ? "default" : "outline"}>
                            {user.isVerified ? "Zweryfikowany" : "Niezweryfikowany"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="font-body-regular text-[#666666]">E-mail</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <span className="font-body-regular text-[#666666]">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-body-regular text-[#666666]">
                          {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                          className="flex items-center gap-1"
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="h-3 w-3" />
                              Deaktywuj
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3" />
                              Aktywuj
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-[#CCCCCC] mx-auto mb-4" />
                  <p className="font-body-medium text-[#666666]">Brak użytkowników spełniających kryteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
