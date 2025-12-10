import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UserService from "../../../Services/UserRegisterService";
import NotificationService from "../../../Services/NotificationServices";
import { useUser } from "../../../context/UserContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

const schema = yup.object({
    email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria"),
});

export default function Login() {
    const navigate = useNavigate();
    const { saveUser } = useUser(); 

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ 
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    // ✅ REMOVIDO useEffect innecesario
    
    const onSubmit = async (data) => {
        try {
            const response = await UserService.loginUser(data);

            if (response.data && response.data.data) {
                const token = response.data.data;    
                const userData = saveUser(token);
             
                if (userData) {
                    toast.success(`¡Bienvenida ${userData.UserName}!`);
                    
                  
                    try {
                        await NotificationService.InsertNotificationLogIn(userData.Id);
                    } catch (error) {
                        console.error("Error al insertar notificación:", error);
                    }
                    
                    navigate("/notifications");
                } else {
                    toast.error("Token inválido");
                }
            } else {
               
                toast.error("Credenciales inválidas");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            toast.error("Error al iniciar sesión");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <Card className="w-full max-w-md shadow-lg border-2 border-[#0a1e4a] bg-white">
                <CardHeader className="py-4">
                    <CardTitle className="text-center text-2xl font-bold text-[#0a1e4a]">
                        Iniciar Sesión
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-[#0a1e4a] font-semibold">
                                Correo electrónico
                            </Label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                {...register("email")}
                                className="w-full px-3 py-2 text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md h-10 focus:ring-2 focus:ring-[#DFA200] focus:border-transparent"
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-[#0a1e4a] font-semibold">
                                Contraseña
                            </Label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register("password")}
                                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md h-10 focus:ring-2 focus:ring-[#DFA200] focus:border-transparent"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#DFA200] hover:bg-[#c88f00] text-white font-semibold mt-2 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </Button>

                        <p className="text-sm text-center mt-4 text-gray-700">
                            ¿No tienes cuenta?{" "}
                            <a href="/register" className="text-[#DFA200] underline hover:text-[#c88f00] font-semibold">
                                Regístrate
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
