// src/components/Pages/User/Register.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UserService from "../../../Services/UserRegisterService";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

const schema = yup.object({
    username: yup.string().required("El nombre es obligatorio"),
    email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ 
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    const onSubmit = async (data) => {
        try {
            const userData = {
                username: data.username,
                email: data.email,
                password: data.password,
                role_id: 2, // Estudiante por defecto
                insurance_id: 3, // Sin seguro por defecto
                institution_id: null,
                position_id: null,
                state: true,
                work_charge: null
            };

            const response = await UserService.createUser(userData);
            
            if (response.data) {
                toast.success("Usuario registrado exitosamente");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Error al registrar usuario");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border-2 border-[#0a1e4a] bg-white/10 backdrop-blur-lg text-white">
                <CardHeader className="py-4">
                    <CardTitle className="text-center text-2xl font-bold text-[#0a1e4a]">
                        Registrarse
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="text-[#0a1e4a] font-semibold">
                                Nombre de usuario
                            </Label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Juan Pérez"
                                {...register("username")}
                                className="w-full px-3 py-2 text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md h-10"
                            />
                            {errors.username && (
                                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-[#0a1e4a] font-semibold">
                                Correo electrónico
                            </Label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                {...register("email")}
                                className="w-full px-3 py-2 text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md h-10"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
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
                                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md h-10"
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#DFA200] hover:bg-[#c88f00] text-[#0a1e4a] font-semibold mt-2 h-10"
                        >
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                        </Button>

                        <p className="text-sm text-center mt-4 text-[#0a1e4a]">
                            ¿Ya tienes cuenta?{" "}
                            <a href="/login" className="text-[#DFA200] underline hover:text-[#c88f00]">
                                Inicia sesión
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
