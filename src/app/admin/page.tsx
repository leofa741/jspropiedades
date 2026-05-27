'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';

interface User {
  _id: string;
  name: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  email: string;
  phone: string;
  role: 'admin' | 'superadmin' | 'vendedor' | 'user' | string;
  img?: string;
  token?: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const validateAndFetch = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        router.push('/');
        return;
      }

      const token = session?.user?.token || localStorage.getItem('token');
      if (!token) {
        toast.error('Acceso denegado');
        router.push('/');
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role !== 'admin' && decodedToken.role !== 'superadmin') {
          toast.error('Acceso restringido a administradores');
          router.push('/');
          return;
        }

        await fetchUsers(token);
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error al validar sesión:', err);
        toast.error('Sesión inválida');
        router.push('/');
      }
    };

    validateAndFetch();
  }, [session, status, router]);

  const fetchUsers = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        throw new Error('Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      toast.error('Hubo un error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const token = session?.user?.token || localStorage.getItem('token');

    if (!token) {
      toast.error('Sesión expirada');
      router.push('/login');
      return;
    }

    if (userId === session?.user?.id) {
      toast.error('No puedes eliminar tu propia cuenta.');
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará el usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f3f4f6',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar el usuario');

      toast.success('Usuario eliminado con éxito');
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      toast.error('Hubo un error al eliminar el usuario');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Verificando permisos...</p>
        {isLoading && (
          <div className="ml-4 loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
        )}
      </div>
    );
  }

  // 🔹 SEPARAR USUARIOS POR ROL
  const adminRoles = ['admin', 'superadmin', 'vendedor'];
  const usuariosAdmin = users.filter(u => adminRoles.includes(u.role));
  const usuariosFinales = users.filter(u => u.role === 'user');

  const cardClasses = "border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800";
  const tableHeaderClasses = "p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800";
  const tableCellClasses = "p-4 text-xs text-gray-300 border-t border-gray-700";

  // 🔹 Componente reutilizable para tabla de usuarios
  const UsersTable = ({ usersList, title, icon, emptyMessage, roleFilter }: {
    usersList: User[];
    title: string;
    icon: React.ReactNode;
    emptyMessage: string;
    roleFilter?: string[];
  }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-violet-400">{icon}</span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">
          {usersList.length}
        </span>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {usersList.length === 0 ? (
          <div className={cardClasses}>
            <p className="text-gray-400 text-center py-4">{emptyMessage}</p>
          </div>
        ) : (
          usersList.map(user => (
            <UserCard key={user._id} user={user} onDelete={handleDeleteUser} />
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
        {usersList.length === 0 ? (
          <div className={cardClasses}>
            <p className="text-gray-400 text-center py-4">{emptyMessage}</p>
          </div>
        ) : (
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className={tableHeaderClasses}>Foto</th>
                <th className={tableHeaderClasses}>Nombre</th>
                <th className={tableHeaderClasses}>Apellido</th>
                <th className={tableHeaderClasses}>Ciudad</th>
                <th className={tableHeaderClasses}>Teléfono</th>
                <th className={tableHeaderClasses}>Correo</th>
                <th className={tableHeaderClasses}>Rol</th>
                <th className={tableHeaderClasses}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(user => (
                <tr key={user._id} className="hover:bg-gray-750 transition">
                  <td className={tableCellClasses}>
                    {user.img ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image src={user.img} alt={`Avatar de ${user.name}`} fill sizes="2rem" style={{ objectFit: 'cover' }} className="bg-gray-700" />
                      </div>
                    ) : <span className="text-gray-500 text-xs">—</span>}
                  </td>
                  <td className={tableCellClasses}>{user.name}</td>
                  <td className={tableCellClasses}>{user.lastName}</td>
                  <td className={tableCellClasses}>{user.city || '—'}</td>
                  <td className={tableCellClasses}>{user.phone || '—'}</td>
                  <td className={`${tableCellClasses} break-all max-w-[150px]`}>{user.email}</td>
                  <td className={tableCellClasses}>
                    <RoleBadge role={user.role} />
                  </td>
                  <td className={tableCellClasses}>
                    <div className="flex gap-2">
                      <Link href={`/admin/edit-user/${user._id}`} className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded text-xs transition">Editar</Link>
                      <button onClick={() => handleDeleteUser(user._id)} className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs transition">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // 🔹 Componente Card para móvil
  const UserCard = ({ user, onDelete }: { user: User; onDelete: (id: string) => void }) => (
    <div className={cardClasses}>
      <div className="flex items-start space-x-4">
        {user.img ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src={user.img} alt={`Avatar de ${user.name}`} fill sizes="3rem" style={{ objectFit: 'cover' }} className="bg-gray-700" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">—</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{user.name} {user.lastName}</p>
          <p className="text-sm text-amber-400 truncate">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1"><strong>Rol:</strong> <RoleBadge role={user.role} inline /></p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Link href={`/admin/edit-user/${user._id}`} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded text-sm text-center transition">Editar</Link>
        <button onClick={() => onDelete(user._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition">Eliminar</button>
      </div>
    </div>
  );

  // 🔹 Badge de rol con colores
  const RoleBadge = ({ role, inline = false }: { role: string; inline?: boolean }) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-900/50 text-red-400 border-red-500/30',
      superadmin: 'bg-purple-900/50 text-purple-400 border-purple-500/30',
      vendedor: 'bg-blue-900/50 text-blue-400 border-blue-500/30',
      user: 'bg-gray-700 text-gray-300 border-gray-600/30',
    };
    const base = inline ? 'px-1.5 py-0.5' : 'px-2.5 py-1 rounded-full text-xs';
    return (
      <span className={`${base} border ${styles[role] || styles.user} font-medium`}>
        {role}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <br /><br /><br /><br /><br /><br />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Administrar Usuarios</h1>
        <Link href="/gestion" className="text-blue-400 hover:text-blue-500 flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400 text-lg">Cargando usuarios...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400 text-lg">No hay usuarios registrados.</p>
        </div>
      ) : (
        <>
          {/* 🔹 Sección 1: Administradores y roles especiales */}
          <UsersTable
            usersList={usuariosAdmin}
            title="Equipo Interno"
            icon={<FontAwesomeIcon icon={faUsers} />}
            emptyMessage="No hay usuarios con roles administrativos."
            roleFilter={adminRoles}
          />

          {/* 🔹 Sección 2: Usuarios finales (role: 'user') */}
          <div className="border-t border-gray-700 pt-8">
            <UsersTable
              usersList={usuariosFinales}
              title="Usuarios Finales"
              icon={<FontAwesomeIcon icon={faUser} />}
              emptyMessage="No hay usuarios finales registrados."
              roleFilter={['user']}
            />
          </div>
        </>
      )}
    </div>
  );
}