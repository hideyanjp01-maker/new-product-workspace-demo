import { useAppStore } from '../store/appStore'
import { getRoles } from '../data/mockData'
import { Select } from './ui'
import './RoleSwitcher.css'

export default function RoleSwitcher() {
  const { currentRoleId, setCurrentRoleId } = useAppStore()
  const roles = getRoles()

  // 仅显示正确的11个角色（getRoles 已返回正确的11个角色）
  const handleRoleChange = (roleId: string) => {
    setCurrentRoleId(roleId)
  }

  const options = roles.map(role => ({
    value: role.id,
    label: role.name
  }))

  return (
    <div className="role-switcher">
      <label className="role-switcher-label">角色视角</label>
      <Select
        options={options}
        value={currentRoleId || ''}
        onChange={(e) => handleRoleChange(e.target.value)}
        style={{ minWidth: '180px' }}
      />
    </div>
  )
}
