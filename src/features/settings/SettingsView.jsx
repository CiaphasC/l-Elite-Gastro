const ToggleSetting = ({ title, description, enabled }) => (
  <div className="flex flex-col gap-4 border-b border-white/5 pb-6 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h4 className="font-medium text-white">{title}</h4>
      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </div>
    <div
      className={`relative h-6 w-12 cursor-pointer rounded-full ${
        enabled ? "bg-[#E5C07B]" : "border border-white/10 bg-zinc-800"
      }`}
    >
      <div
        className={`absolute top-1 h-4 w-4 rounded-full shadow-md ${
          enabled ? "right-1 bg-white" : "left-1 bg-zinc-500"
        }`}
      />
    </div>
  </div>
);

const SettingsView = () => (
  <div className="glass-panel animate-in fade-in slide-in-from-bottom max-w-2xl rounded-[2.5rem] p-5 duration-500 sm:p-10">
    <h3 className="mb-6 font-serif text-xl text-white sm:mb-8 sm:text-2xl">Configuracion del Sistema</h3>
    <div className="space-y-8">
      <ToggleSetting
        title="Modo Oscuro Profundo"
        description="Activar tema Midnight Luxe para entornos nocturnos."
        enabled
      />
      <ToggleSetting
        title="Notificaciones de Cocina"
        description="Recibir alertas sonoras cuando un plato este listo."
        enabled={false}
      />
      <ToggleSetting
        title="Impresion Automatica"
        description="Enviar ticket a barra al confirmar comanda."
        enabled
      />
    </div>
  </div>
);

export default SettingsView;
